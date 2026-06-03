local _M = {}
local cjson = require("cjson")

function _M.get_request_details()
	-- Read the request body safely
	ngx.req.read_body()
    local body_data = ngx.req.get_body_data()

	-- If body is empty but a file was uploaded, read the temporary file path instead
    if not body_data then
        local body_file = ngx.req.get_body_file()
        if body_file then
            body_data = "[Body stored in temporary file: " .. body_file .. "]"
        end
    end

	-- Try to parse body as JSON if applicable
	local body_json = nil
    if body_data and string.find(ngx.req.get_headers()["content-type"] or "", "application/json") then
        pcall(function() body_json = cjson.decode(body_data) end)
    end

	local details = {
        method = ngx.req.get_method(),
        http_version = ngx.req.http_version(),
        headers = ngx.req.get_headers(),       -- Gets all request headers
        uri_args = ngx.req.get_uri_args(),     -- Gets all GET query string parameters
        post_args = ngx.req.get_post_args(),   -- Gets form-urlencoded data
        raw_body = body_data or "",
        parsed_body_json = body_json
    }

    return details
end

return _M
