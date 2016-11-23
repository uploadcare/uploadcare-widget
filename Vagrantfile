Vagrant.configure(2) do |config|
    config.vm.box = "ubuntu/trusty64"

    config.vm.network "forwarded_port", guest: 3000, host: 6000

    config.vm.provision "preinstall", type: "shell", inline: <<-SHELL
        sudo apt-get update
        sudo apt-get install -y software-properties-common git mercurial build-essential zlib1g-dev
        sudo apt-add-repository -y ppa:brightbox/ruby-ng
        sudo apt-get update
        sudo apt-get install -y ruby2.3 ruby2.3-dev
        sudo gem install bundler
        sudo gem install rake -v 11.0.1
    SHELL

    config.vm.provision "install", type: "shell", inline: <<-SHELL
        cd /vagrant
        bundle install
        cd /vagrant/test/dummy
        bundle install
    SHELL

    config.vm.provision "change_ssh_dir", type: "shell", inline: <<-SHELL
        echo "cd /vagrant" >> /home/vagrant/.bashrc
    SHELL
end
