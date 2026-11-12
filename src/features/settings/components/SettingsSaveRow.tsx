import { useIsOrgAdmin } from '@/app/useIsOrgAdmin'
import { AdminRequiredDialog } from '@/components/common/AdminRequiredDialog'
import { Button } from '@/components/ui/button'
import { FieldError } from '@/components/ui/field'

type Props = {
  changed: boolean
  pending: boolean
  saved: boolean
  error: Error | null
}

export function SettingsSaveRow({ changed, pending, saved, error }: Props) {
  const isAdmin = useIsOrgAdmin()

  return (
    <>
      <FieldError>{error?.message}</FieldError>
      <div className="flex items-center gap-4">
        {isAdmin ? (
          <Button type="submit" disabled={!changed || pending}>
            {pending ? 'Saving…' : 'Save'}
          </Button>
        ) : (
          <AdminRequiredDialog trigger={<Button>Save</Button>} />
        )}
        {saved && !changed && (
          <p role="status" className="text-sm text-muted-foreground">
            Saved
          </p>
        )}
      </div>
    </>
  )
}
