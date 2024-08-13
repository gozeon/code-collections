require "capistrano/scm/plugin"
module Capistrano
    class LocalPlugin < ::Capistrano::SCM::Plugin
        def set_defaults
           
        end

        def define_tasks
            # The namespace can be whatever you want, but its best
            # to choose a name that matches your plugin name.
            eval_rakefile File.expand_path("../../tasks/local.rake", __FILE__)
        end

        def register_hooks
            # Tell Capistrano to run the custom create_release task
            # during deploy.
            after "deploy:new_release_path", "local:create_release"
            before "deploy:set_current_revision", "local:set_current_revision"
        end
    end
end