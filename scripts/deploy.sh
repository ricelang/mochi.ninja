#!/bin/bash
DEPLOY_TO=/srv/http/domain/mochi

rm -rf mochi.ninja
git clone git@github.com:mochi-lang/mochi.ninja.git --depth 1

deploy_name=`ls -la $DEPLOY_TO | wc -l`
deploy_name=$((deploy_name + 2))

mkdir $DEPLOY_TO/$deploy_name
ls -la ./
sudo rsync -rvap mochi.ninja/public $DEPLOY_TO/$deploy_name --exclude ".git"
rm -rf mochi.ninja
echo  ln -nsf $DEPLOY_TO/$deploy_name $DEPLOY_TO/current
sudo ln -nsf $DEPLOY_TO/$deploy_name $DEPLOY_TO/current
sudo chown -R www-data:www-data $DEPLOY_TO

echo "Cleanup"
sudo ls -lt $DEPLOY_TO | tail -n +5 | awk '{print $9}' |sudo xargs -I{} rm -rf $DEPLOY_TO/{}
