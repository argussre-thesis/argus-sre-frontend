// A chart release bumps only this line.
const chartVersion = '0.1.0'
const chart = 'oci://registry-1.docker.io/tsandas/argus-runner'
const namespace = 'argus-runner'
const secretName = 'argus-runner-token'

// Left as a placeholder when unset, so the commands still show what goes where.
const gatewayUrl = import.meta.env.VITE_GATEWAY_URL?.replace(/\/$/, '') ?? '<GATEWAY_URL>'

export type CommandStep = {
  label: string
  command: string
}

// Each command is one line, so it pastes in bash and PowerShell alike.
export function runnerInstallSteps(clusterName: string, token: string): CommandStep[] {
  return [
    {
      label: 'Create the namespace',
      command: `kubectl create namespace ${namespace}`,
    },
    {
      label: 'Store the token in a Secret',
      command: `kubectl -n ${namespace} create secret generic ${secretName} --from-literal=token=${token}`,
    },
    {
      label: 'Install the runner with Helm',
      command: `helm install argus-runner ${chart} --version ${chartVersion} -n ${namespace} --set gatewayUrl=${gatewayUrl} --set clusterName=${clusterName} --set existingSecret=${secretName}`,
    },
  ]
}

// The runner reads its token only at startup, so a new token needs a restart.
export function runnerRotateSteps(token: string): CommandStep[] {
  return [
    {
      // apply, not create: the Secret already exists.
      label: 'Replace the token in the Secret',
      command: `kubectl -n ${namespace} create secret generic ${secretName} --from-literal=token=${token} --dry-run=client -o yaml | kubectl apply -f -`,
    },
    {
      label: 'Restart the runner so it picks up the new token',
      command: `kubectl -n ${namespace} rollout restart deploy/argus-runner`,
    },
  ]
}
