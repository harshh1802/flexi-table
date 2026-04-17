
module FlexiTable
using Dash

const resources_path = realpath(joinpath( @__DIR__, "..", "deps"))
const version = "0.0.7"

include("jl/''_flexitable.jl")

function __init__()
    DashBase.register_package(
        DashBase.ResourcePkg(
            "flexi_table",
            resources_path,
            version = version,
            [
                DashBase.Resource(
    relative_package_path = "flexi_table.min.js",
    external_url = nothing,
    dynamic = nothing,
    async = nothing,
    type = :js
),
DashBase.Resource(
    relative_package_path = "flexi_table.min.js.map",
    external_url = nothing,
    dynamic = true,
    async = nothing,
    type = :js
)
            ]
        )

    )
end
end
