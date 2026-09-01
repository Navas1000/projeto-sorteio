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

    # Permite acessar o NGINX pelo Windows/Mac em localhost:8080
    frontend.vm.network "forwarded_port",
      guest: 80,
      host: 8080

    frontend.vm.provider "virtualbox" do |vb|
      vb.name = "frontend"
      vb.memory = 2048
      vb.cpus = 1
    end

    frontend.vm.provision "shell", inline: <<-SHELL
      apt-get update -y
      apt-get install -y nginx net-tools iptables curl

      # Permite que o frontend encaminhe pacotes das VMs internas
      sysctl -w net.ipv4.ip_forward=1

      # Descobre automaticamente a interface que possui acesso externo
      OUT_IF=$(ip route | awk '/default/ {print $5; exit}')

      # Faz NAT da rede interna para a Internet
      iptables -t nat -A POSTROUTING \
        -s 10.20.30.0/24 \
        -o "$OUT_IF" \
        -j MASQUERADE

      # ----------------------------------------------------------
      # Instala Node.js e faz o build do Angular
      # ----------------------------------------------------------
      curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
      apt-get install -y nodejs

      cd /vagrant/frontend
      npm install
      npm run build -- --configuration production

      # Descobre automaticamente onde o build gerou o index.html
      DIST_DIR=$(dirname "$(find dist -name index.html | head -n1)")

      rm -rf /var/www/sorteio
      mkdir -p /var/www/sorteio
      cp -r "$DIST_DIR"/* /var/www/sorteio/

      # ----------------------------------------------------------
      # Publica a configuração do NGINX
      # ----------------------------------------------------------
      cp /vagrant/configs/nginx/projeto-sorteio.conf /etc/nginx/sites-available/projeto-sorteio.conf
      ln -sf /etc/nginx/sites-available/projeto-sorteio.conf /etc/nginx/sites-enabled/projeto-sorteio.conf
      rm -f /etc/nginx/sites-enabled/default

      systemctl enable nginx
      systemctl restart nginx
    SHELL
  end


  # ============================================================
  # BANCO DE DADOS
  # MySQL
  # ============================================================

  config.vm.define "db" do |db|
    db.vm.hostname = "db"

    # Rede interna do projeto
    db.vm.network "private_network",
      ip: "10.20.30.3",
      netmask: "255.255.255.0",
      virtualbox__intnet: "intnet1"

    # Permite acessar o MySQL da VM pelo Windows/Mac
    db.vm.network "forwarded_port",
      guest: 3306,
      host: 3306

    db.vm.provider "virtualbox" do |vb|
      vb.name = "db"
      vb.memory = 1024
      vb.cpus = 1
    end

    db.vm.provision "shell", inline: <<-SHELL
      apt-get update -y
      apt-get install -y mysql-server net-tools

      # Remove a rota padrão criada pelo NAT do Vagrant
      ip route del default via 10.0.2.2 2>/dev/null || true

      # Remove rotas específicas criadas pelo DHCP do NAT
      ip route del 8.8.8.8 via 10.0.2.2 2>/dev/null || true
      ip route del 8.8.4.4 via 10.0.2.2 2>/dev/null || true

      # Define o frontend como gateway padrão
      ip route replace default via 10.20.30.1

      # ----------------------------------------------------------
      # Libera o MySQL para a rede interna
      # ----------------------------------------------------------
      sed -i "s/^bind-address.*/bind-address = 0.0.0.0/" /etc/mysql/mysql.conf.d/mysqld.cnf

      systemctl enable mysql
      systemctl restart mysql

      # ----------------------------------------------------------
      # Importa o schema e cria o usuário da aplicação
      # ----------------------------------------------------------
      mysql < /vagrant/database/v1.sql

      mysql -e "CREATE USER IF NOT EXISTS 'projeto'@'%' IDENTIFIED BY 'projeto123';"
      mysql -e "GRANT ALL PRIVILEGES ON projeto_sorteio.* TO 'projeto'@'%';"
      mysql -e "FLUSH PRIVILEGES;"
    SHELL
  end


  # ============================================================
  # BACKEND
  # Java / Spring Boot
  # ============================================================

  config.vm.define "backend" do |backend|
    backend.vm.hostname = "backend"

    # Rede interna do projeto
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
      apt-get install -y openjdk-17-jdk net-tools

      # Remove a rota padrão criada pelo NAT do Vagrant
      ip route del default via 10.0.2.2 2>/dev/null || true

      # Remove rotas específicas criadas pelo DHCP do NAT
      ip route del 8.8.8.8 via 10.0.2.2 2>/dev/null || true
      ip route del 8.8.4.4 via 10.0.2.2 2>/dev/null || true

      # Define o frontend como gateway padrão
      ip route replace default via 10.20.30.1

      # ----------------------------------------------------------
      # Build do backend Spring Boot
      # ----------------------------------------------------------
      cd /vagrant/backend
      chmod +x mvnw
      ./mvnw clean package -DskipTests

      JAR=$(find target -maxdepth 1 -name "*.jar" | head -n1)

      # Cria serviço systemd para o backend subir sozinho
      cat > /etc/systemd/system/backend.service <<EOF
[Unit]
Description=Backend Sorteio
After=network.target

[Service]
ExecStart=/usr/bin/java -jar $JAR
Restart=always
User=root

[Install]
WantedBy=multi-user.target
EOF

      systemctl daemon-reload
      systemctl enable backend
      systemctl restart backend
    SHELL
  end

end