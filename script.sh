#!/bin/sh
composer archive create -t dir -n .
cd ..
cd fabric-dev-servers
./stopFabric.sh
./startFabric.sh
cd ..
cd supplychain-network
composer network install --card PeerAdmin@hlfv1 --archiveFile supplychain-network@0.0.1.bna
composer network start --networkName supplychain-network --networkVersion 0.0.1 --networkAdmin admin --networkAdminEnrollSecret adminpw --card PeerAdmin@hlfv1 --file networkadmin.card
composer network ping --card admin@supplychain-network
composer-rest-server


