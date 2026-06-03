local _M = {}

-- OpenResty core string functions are blazing fast
function _M.base64(raw_str)
    local encoded = ngx.encode_base64(raw_str)
    local decoded = ngx.decode_base64(encoded)

    return {
        original = raw_str,
        base64_encoded = encoded,
        base64_decoded = decoded,
    }
end


-- Standard Lua String Manipulations
function _M.basic_ops(raw_str)
    return {
        original = raw_str,
        upper = string.upper(raw_str),
        lower = string.lower(raw_str),
        len = string.len(raw_str),
        -- Standard Lua sub-string slicing (1-indexed)
        substring = string.sub(raw_str, 1, 5)
    }
end

-- Lua Standard Find and Replace (Good for exact matching, no regex)
function _M.exact_find_and_replace(subject, search_target, replacement)
    -- string.find returns start and end indices. Third argument 'true' turns off pattern matching.
    local start_idx, end_idx = string.find(subject, search_target, 1, true)

    -- string.gsub replaces exact strings when patterns are not used
    local clean_str, count = string.gsub(subject, search_target, replacement)

    return {
        found = start_idx ~= nil,
        start_at = start_idx or 0,
        end_at = end_idx or 0,
        result_string = clean_str,
        replacements_count = count
    }
end

-- High-Performance OpenResty Regex Matching (ngx.re.find / ngx.re.match)
-- Uses PCRE with JIT compilation enabled via the "jo" flags
function _M.regex_search(subject, pattern)
    -- ngx.re.find only returns indices (blazing fast, low memory overhead)
    local start_idx, end_idx, err = ngx.re.find(subject, pattern, "jo")
    if err then
        ngx.log(ngx.ERR, "Regex find error: ", err)
    end

    -- ngx.re.match fetches the actual string data and captured groups
    -- Example pattern with captures: "([0-9]+)-([a-z]+)"
    local res, match_err = ngx.re.match(subject, pattern, "jo")
    local captures = {}

    if res then
        -- res[0] is the whole match, res[1], res[2] are sub-captures
        for i = 0, #res do
            captures[i] = res[i]
        end
    end

    return {
        has_match = start_idx ~= nil,
        matched_indices = { start_pos = start_idx, end_pos = end_idx },
        extracted_groups = captures
    }
end

-- High-Performance OpenResty Regex Global Replace (ngx.re.gsub)
function _M.regex_replace(subject, pattern, replacement)
    -- "jo" flag: 'j' enables PCRE JIT compilation, 'o' caches the compiled regex worker-wide
    local new_str, n_replacements, err = ngx.re.gsub(subject, pattern, replacement, "jo")
    if err then
        ngx.log(ngx.ERR, "Regex replace error: ", err)
        return subject
    end

    return {
        processed_str = new_str,
        total_replaced = n_replacements
    }
end

return _M
