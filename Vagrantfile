Vagrant.configure("2") do |config|

  # Sistema operacional usado pelas três VMs
  config.vm.box = "ubuntu/jammy64"


  # ============================================================
  # FRONTEND
  # Angular + NGINX + Gateway da rede interna
  # ============================================================

  config.vm.define "frontend" do |frontend|

    frontend.vm.hostname = "frontend"

    # Rede interna do projeto
    frontend.vm.network "private_network",
      ip: "10.20.30.1",
      netmask: "255.255.255.0",
      virtualbox__intnet: "intnet1"

    # Permite acessar o NGINX pelo Windows em localhost:8080
    frontend.vm.network "forwarded_port",
      guest: 80,
      host: 8080

    frontend.vm.provider "virtualbox" do |vb|
      vb.name = "frontend"
      vb.memory = 1024
      vb.cpus = 1
    end

    frontend.vm.provision "shell", inline: <<-SHELL

      apt-get update -y

      # Instala os programas necessários no frontend
      apt-get install -y nginx net-tools iptables

      # Permite que o frontend encaminhe pacotes de outras VMs
      sysctl -w net.ipv4.ip_forward=1

      # Descobre qual interface do frontend possui acesso externo
      OUT_IF=$(ip route | awk '/default/ {print $5; exit}')

      # Faz NAT da rede interna para a Internet
      iptables -t nat -A POSTROUTING \
        -s 10.20.30.0/24 \
        -o "$OUT_IF" \
        -j MASQUERADE

      # Inicia o NGINX
      systemctl enable nginx
      systemctl restart nginx

    SHELL
  end


  # ============================================================
  # BACKEND
  # Java / Spring Boot
  # ============================================================

  config.vm.define "backend" do |backend|

    backend.vm.hostname = "backend"

    # Rede interna
    backend.vm.network "private_network",
      ip: "10.20.30.2",
      netmask: "255.255.255.0",
      virtualbox__intnet: "intnet1"

    backend.vm.provider "virtualbox" do |vb|
      vb.name = "backend"
      vb.memory = 1536
      vb.cpus = 1
    end

    backend.vm.provision "shell", inline: <<-SHELL

      apt-get update -y

      # Java para executar o Spring Boot
      apt-get install -y openjdk-17-jdk net-tools

      # Define o frontend como gateway para acesso externo
      ip route replace default via 10.20.30.1

    SHELL
  end


  # ============================================================
  # BANCO DE DADOS
  # MySQL
  # ============================================================

  config.vm.define "db" do |db|

    db.vm.hostname = "db"

    # Rede interna
    db.vm.network "private_network",
      ip: "10.20.30.3",
      netmask: "255.255.255.0",
      virtualbox__intnet: "intnet1"

    db.vm.provider "virtualbox" do |vb|
      vb.name = "db"
      vb.memory = 1024
      vb.cpus = 1
    end

    db.vm.provision "shell", inline: <<-SHELL

      apt-get update -y

      # Instala o banco MySQL
      apt-get install -y mysql-server net-tools

      # Define o frontend como gateway
      ip route replace default via 10.20.30.1

      # Faz o MySQL iniciar junto com a VM
      systemctl enable mysql
      systemctl restart mysql

    SHELL
  end

end