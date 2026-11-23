import bpy, sys, os, math
from mathutils import Vector

svg_dir = sys.argv[sys.argv.index("--") + 1]
names = sorted(f for f in os.listdir(svg_dir) if f.endswith(".svg"))

for name in names:
    bpy.ops.wm.read_factory_settings(use_empty=True)
    sc = bpy.context.scene
    try:
        sc.render.engine = "BLENDER_EEVEE"
    except TypeError:
        sc.render.engine = "BLENDER_EEVEE_NEXT"
    sc.render.resolution_x = sc.render.resolution_y = 1024
    sc.view_settings.view_transform = "AgX"

    bpy.ops.import_curve.svg(filepath=os.path.join(svg_dir, name))
    objs = [o for o in sc.objects if o.type == "CURVE"]
    bpy.ops.object.select_all(action="DESELECT")
    for o in objs:
        o.select_set(True)
    bpy.context.view_layer.objects.active = objs[0]
    bpy.ops.object.join()
    logo = bpy.context.view_layer.objects.active
    bpy.ops.object.origin_set(type="ORIGIN_GEOMETRY", center="BOUNDS")
    logo.location = (0, 0, 0)
    size = max(logo.dimensions.x, logo.dimensions.y) / logo.scale.x  # in curve (local) units
    k = size / 56  # one SVG unit, in local units (the art is ~56 units wide)
    cu = logo.data
    # Open paths (SVG strokes) become round tubes in a second object; filled shapes get extruded.
    open_splines = [sp for sp in cu.splines if not sp.use_cyclic_u]
    if open_splines:
        tube_data = cu.copy()
        for sp in [sp for sp in tube_data.splines if sp.use_cyclic_u]:
            tube_data.splines.remove(sp)
        for sp in [sp for sp in cu.splines if not sp.use_cyclic_u]:
            cu.splines.remove(sp)
        tube_data.dimensions = "3D"
        tube_data.bevel_mode = "ROUND"
        tube_data.fill_mode = "FULL"
        tube_data.bevel_depth = 2.2 * k
        tube_data.bevel_resolution = 6
        tube_data.extrude = 0
        tube = bpy.data.objects.new("tube", tube_data)
        sc.collection.objects.link(tube)
    cu.dimensions = "2D"
    cu.fill_mode = "BOTH"
    cu.extrude = 1.4 * k
    cu.bevel_depth = 0.8 * k
    cu.bevel_resolution = 6
    cu.resolution_u = 32
    s = 2.0 / size
    logo.scale = (s, s, s)
    logo.location.z = 2.4 * k * s
    if open_splines:
        bpy.context.view_layer.update()
        tube.matrix_world = logo.matrix_world.copy()

    mat = bpy.data.materials.new("logo")
    mat.use_nodes = True
    b = mat.node_tree.nodes["Principled BSDF"]
    b.inputs["Base Color"].default_value = (0.9, 0.91, 0.93, 1)
    b.inputs["Metallic"].default_value = 0.9
    b.inputs["Roughness"].default_value = 0.22
    logo.data.materials.append(mat)
    if open_splines:
        tube.data.materials.append(mat)

    bpy.ops.mesh.primitive_plane_add(size=20)
    floor = bpy.context.active_object
    fm = bpy.data.materials.new("floor")
    fm.use_nodes = True
    fb = fm.node_tree.nodes["Principled BSDF"]
    fb.inputs["Base Color"].default_value = (0.006, 0.007, 0.009, 1)
    fb.inputs["Roughness"].default_value = 0.35
    floor.data.materials.append(fm)

    world = bpy.data.worlds.new("w")
    world.use_nodes = True
    world.node_tree.nodes["Background"].inputs["Color"].default_value = (0.15, 0.16, 0.18, 1)
    sc.world = world

    for loc, energy, size_ in [((3, -3, 5), 500, 3), ((-4, 1, 2), 200, 4), ((0, 4, 1.5), 60, 2)]:
        ld = bpy.data.lights.new("l", "AREA")
        ld.energy, ld.size = energy, size_
        lo = bpy.data.objects.new("l", ld)
        lo.location = loc
        lo.rotation_euler = (Vector((0, 0, 0)) - Vector(loc)).to_track_quat("-Z", "Y").to_euler()
        sc.collection.objects.link(lo)

    cam_d = bpy.data.cameras.new("c")
    cam_d.lens = 120
    cam = bpy.data.objects.new("c", cam_d)
    cam.location = (0, -6.2, 6.2)
    cam.rotation_euler = (math.radians(45), 0, 0)
    sc.collection.objects.link(cam)
    sc.camera = cam

    sc.render.filepath = os.path.join(svg_dir, "renders", name.replace(".svg", ".png"))
    bpy.ops.render.render(write_still=True)
