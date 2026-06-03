local _M = {}

function _M.generate_hashes(secret_data)
    -- Built-in MD5 (returns raw binary, so we wrap it in hex)
    local md5_hex = ngx.md5(secret_data)

    -- Using the resty.sha256 library bundled with OpenResty
    local resty_sha256 = require("resty.sha256")
    local str = require("resty.string")

    local sha256 = resty_sha256:new()
    sha256:update(secret_data)
    local digest = sha256:final()

    return {
        md5 = md5_hex,
        sha256 = str.to_hex(digest) -- Convert binary digest to a readable hex string
    }
end

return _M
