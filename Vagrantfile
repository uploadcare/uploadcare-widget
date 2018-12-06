Vagrant.configure(2) do |config|
    config.vm.box = "ubuntu/trusty64"

    config.vm.provider "virtualbox" do |v|
      v.memory = 1024
    end

    config.vm.network "forwarded_port", guest: 3000, host: 3030

    if Vagrant::Util::Platform.windows? then
        config.vm.provision :shell, :inline => "echo 'Windows! Home dir: #{Dir.home}'"

        # You MUST have a ~/.ssh/id_rsa (GitHub specific) SSH key to copy to VM
        if File.exists?(File.join(Dir.home, ".ssh", "id_rsa")) then
            # Read local machine's GitHub SSH Key (~/.ssh/id_rsa)
            github_ssh_key = File.read(File.join(Dir.home, ".ssh", "id_rsa"))
            # Copy it to VM as the /home/vagrant/.ssh/id_rsa key
            config.vm.provision "shell", privileged: false,
            inline: <<-SHELL
                echo "Windows-specific: Copying local GitHub SSH Key to VM for provisioning..."
                mkdir -p ~/.ssh
                echo "#{github_ssh_key}" > ~/.ssh/id_rsa
                chmod 600 ~/.ssh/id_rsa
            SHELL
        else
            # Else, throw a Vagrant Error. Cannot successfully startup on Windows without a GitHub SSH Key!
            raise Vagrant::Errors::VagrantError, "\n\nERROR: GitHub SSH Key not found at ~/.ssh/id_rsa (required on Windows).\nYou can generate this key manually OR by installing GitHub for Windows (http://windows.github.com/).\n\n"
        end

    else
        config.vm.provision :shell, :inline => "echo 'Not Windows!'"
        config.ssh.forward_agent = true
    end

    config.vm.provision "preinstall", type: "shell", inline: <<-SHELL
        sudo apt-get update
        sudo apt-get install -y ntp software-properties-common git mercurial build-essential zlib1g-dev
        sudo apt-add-repository -y ppa:brightbox/ruby-ng
        sudo apt-get update
        sudo apt-get install -y ruby2.3 ruby2.3-dev
        sudo gem install bundler -v 1.16.1
        sudo gem install rake -v 11.0.1
        curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
        sudo apt-get install -y nodejs
    SHELL

    config.vm.provision "change_ssh_dir", type: "shell", inline: <<-SHELL
        echo "cd /vagrant" >> /home/vagrant/.bashrc
    SHELL
end
