server:
	hugo server --theme=cream --buildDrafts --watch

build:
	hugo --theme=cream

build_draft:
	hugo --theme=cream --buildDrafts

add_subtree:
	git subtree add --prefix=public origin master --squash

pull_subtree:
	git subtree pull --prefix=public origin master

push_subtree:
	git subtree push --prefix=public origin master

deploy: push_subtree
