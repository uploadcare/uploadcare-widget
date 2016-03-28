Vagrant.configure(2) do |config|
    config.vm.box = "ubuntu/trusty64"

    config.vm.network "forwarded_port", guest: 3000, host: 3000

    config.vm.provision "preinstall", type: "shell", inline: <<-SHELL
        sudo apt-get update
        sudo apt-get install -y software-properties-common
        sudo apt-add-repository -y ppa:brightbox/ruby-ng
        sudo apt-get update
        sudo apt-get install -y ruby2.3
        sudo gem install bundler
        sudo gem install rake -v 11.0.1
        sudo apt-get install -y build-essential ruby2.3-dev zlib1g-dev
        sudo apt-get install -y git mercurial
    SHELL

    config.vm.provision "install", type: "shell", inline: <<-SHELL
        cd /vagrant
        bundle install
        cd /vagrant/test/dummy
        bundle install
    SHELL
end
