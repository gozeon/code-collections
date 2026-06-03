--[[
-- Add workspace path to the Lua search pool
package.path = "/app/lua/?.lua;" .. package.path

local debug_service = require("modules.debug_service")
local cjson = require("cjson")

-- Set JSON response header
ngx.header.content_type = "application/json; charset=utf-8"

-- Fetch the variable snapshot from our module
local variables = debug_service.get_all_variables()

-- Return output
ngx.say(cjson.encode(variables))
return ngx.exit(ngx.HTTP_OK)
]]


--[[
-- Dynamically locate directory path to avoid path mismatch issues
local current_dir = string.match(debug.getinfo(1).source, "^@(.*)/")
package.path = current_dir .. "/?.lua;" .. package.path

-- 打印到控制台日志，级别可以选 ngx.ERR, ngx.WARN 或 ngx.INFO
ngx.log(ngx.ERR, "====== [LUA DEBUG] 当前目录是: ", current_dir, " ======")
ngx.log(ngx.ERR, "====== [LUA DEBUG] 当前目录是: ", package.path, " ======")

-- Import modules
local req_service = require("modules.req_service")
local res_service = require("modules.res_service")

--  Collect all data regarding the incoming request via our module
local request_info = req_service.get_request_details()

--  Build a data package to return back to the user
local final_output = {
    status = "success",
    message = "Request parsed through custom modules successfully.",
    received_data = request_info
}

--  Send out response through our response module wrapper with HTTP 200 OK
return res_service.send_json(ngx.HTTP_OK, final_output)
]]

--[[
local current_dir = string.match(debug.getinfo(1).source, "^@(.*)/")
package.path = current_dir .. "/?.lua;" .. package.path

local cjson = require("cjson")
local string_tool = require("modules.string_tool")
local crypto_tool = require("modules.crypto_tool")
local cache_tool  = require("modules.cache_tool")

ngx.header.content_type = "application/json; charset=utf-8"

-- Get query data
local args = ngx.req.get_uri_args()
local input_text = args["text"] or "https://openresty.org"

-- Execute all tests
local results = {
    string_test = string_tool.base64(input_text),
    crypto_test = crypto_tool.generate_hashes(input_text),
    shared_mem_cache_test = cache_tool.handle_counter("user_click_stream")
}

-- Log execution to console
ngx.log(ngx.ERR, "Executed lualib demo modules successfully for input: ", input_text)

ngx.say(cjson.encode(results))
return ngx.exit(ngx.HTTP_OK)
]]

local current_dir = string.match(debug.getinfo(1).source, "^@(.*)/")
package.path =  current_dir .. "/lib/?.lua;" .. current_dir .. "/?.lua;" .. package.path

local cjson = require("cjson")
local http_tool  = require("modules.http_client_tool")
local lock_tool  = require("modules.lock_tool")
-- local redis_tool = require("modules.redis_tool")

local trace = require("modules.trace_service")
trace.init_request_id()

local rate_limit = require("modules.rate_limit_service")
rate_limit.check_rate()

ngx.header.content_type = "application/json; charset=utf-8"

local results = {
    -- 1. Test fetching from a public placeholder API
    http_test = http_tool.fetch_external_api("http://httpbin.org"),

    -- 2. Test the locking system
    lock_test = lock_tool.execute_with_lock("product_stock_count"),

    -- 3. Test Redis connection pool wrapper
    -- redis_test = redis_tool.get_cache_value("my_session_key")
}

ngx.say(cjson.encode(results))
return ngx.exit(ngx.HTTP_OK)

