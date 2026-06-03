local _M = {}

local txid = require "resty.txid"

function _M.init_request_id()
    -- Generate a fast unique ID if not already provided by an upstream gateway
    -- Format: UnixTimestamp-WorkerPID-Random8Digits
    local request_id = ngx.req.get_headers()["X-Request-ID"]

    if not request_id then
        -- local random_suffix = string.format("%08d", math.random(0, 99999999))
        -- request_id = string.format("%d-%d-%s", ngx.time(), ngx.worker.pid(), random_suffix)
		request_id = txid()

        -- Inject into incoming request headers for downstream applications
        ngx.req.set_header("X-Request-ID", request_id)
    end

    -- Store it inside the Nginx variable memory pool for logging
    -- ngx.var.custom_request_id = request_id

    -- Inject into outgoing client response headers
    ngx.header["X-Request-ID"] = request_id
end

return _M
