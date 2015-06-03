# Installation

This page provides directions on downloading and starting InfluxDB Version 0.9.0 - Release Candidate 31.

For users who don't want to install any software and are ready to use InfluxDB, you may want to check out our [managed hosted InfluxDB offering](http://customers.influxdb.com). However, our hosted service is currently only running InfluxDB v0.8.8.

## Requirements
Installation of InfluxDB requires root privileges on the host machine.

### Networking
By default InfluxDB will use TCP ports `8083` and `8086` so these ports should be available on your system. Once installation is complete you can change those ports and other options in the configuration file, which is located by default in `/etc/opt/influxdb`.

## Ubuntu & Debian
Debian users can install by downloading the package and installing it like this:

```bash
# for 64-bit systems
wget http://get.influxdb.org/influxdb_0.9.0-rc31_amd64.deb
sudo dpkg -i influxdb_0.9.0-rc31_amd64.deb
```

Then start the daemon by running:

```
sudo /etc/init.d/influxdb start
```

## RedHat & CentOS
RedHat and CentOS users can install by downloading and installing the rpm like this:

```bash
# for 64-bit systems
wget http://get.influxdb.org/influxdb-0.9.0_rc31-1.x86_64.rpm
sudo rpm -ivh influxdb-0.9.0_rc31-1.x86_64.rpm
```

Then start the daemon by running:

```
sudo /etc/init.d/influxdb start
```

## OS X

Users of OS X 10.8 and higher can install using the [Homebrew](http://brew.sh/) package manager using the `--devel` flag.

```
brew update
brew install influxdb --devel
```

## Generate a configuration file

All InfluxDB packages ship with an example configuration file.  In addition a valid configuration file can be displayed at any time using the command:

```
/opt/influxdb/influxd config
```

<a href="getting_started.html"><font size="6"><b>⇒ Now get started!</b></font></a>
