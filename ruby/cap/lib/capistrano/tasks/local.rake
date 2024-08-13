namespace :local do
    task :create_release do
      # Your code to create the release directory and copy
      # the source code into it goes here.
      on release_roles :all do
        execute :mkdir, "-p", release_path
        upload! fetch(:local_file), release_path
        remote_file = release_path.join(File.basename(fetch(:local_file)))
        execute :chmod, "+x", remote_file
        # ...
      end
    end

    task :start do 
        on roles :all do
            remote_file = current_path.join(File.basename(fetch(:local_file)))

            execute :nohup, remote_file, "> /dev/null 2>&1 &"
        end
    end

    task :stop do 
        on roles :all do
            remote_file = current_path.join(File.basename(fetch(:local_file)))

            if test("pkill -f #{remote_file}")
                info "Process killed successfully."
              else
                info "No process found to kill or an error occurred."
              end
        end
    end

    task :restart do 
        on roles :all do
            Rake::Task["local:stop"].invoke()
            Rake::Task["local:start"].invoke()
        end
    end

    task :set_current_revision do
      # Your code to create the release directory and copy
      # the source code into it goes here.
      on release_roles :all do
          set :current_revision, "v#{Time.now.to_i}"
      end
    end

end