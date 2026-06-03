local _M = {}

function _M.get_all_variables()
	local target_vars = {
        "uri", "request_uri", "args", "request_method",
        "remote_addr", "remote_port", "server_addr", "server_port",
        "scheme", "host", "hostname", "http_user_agent",
        "http_accept", "content_length", "content_type",
        "document_root", "request_filename", "request_time",
        "nginx_version", "pid", "connections_active"
    }
	local vars_dump = {}

	for _, var_name in ipairs(target_vars) do
        local val = ngx.var[var_name]
        vars_dump[var_name] = val or ""
    end

    return vars_dump
end

return _M
