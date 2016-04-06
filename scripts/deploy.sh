#!/bin/bash

rm -rf mochi.ninja
git clone git@github.com:mochi-lang/mochi.ninja.git --depth 1

deploy_name=`ls -la /srv/http/domain/mochi/ | wc -l`
deploy_name=$((deploy_name + 2))

mkdir /srv/http/domain/mochi/$deploy_name
ls -la ./
sudo rsync -rvap mochi.ninja/public /srv/http/domain/mochi/$deploy_name --exclude ".git"
rm -rf mochi.ninja
echo  ln -nsf /srv/http/domain/mochi/$deploy_name /srv/http/domain/mochi/current
sudo ln -nsf /srv/http/domain/mochi/$deploy_name /srv/http/domain/mochi/current
sudo chown -R www-data:www-data /srv/http/domain/mochi
