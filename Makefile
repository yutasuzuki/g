push:
	git add --all && \
	git commit -m "update" && \
	git push origin master

deploy:
	make push && \
	git checkout gh-pages && \
	git merge master && \
	git add --all && \
	git commit -m "deploy" --allow-empty && \
	git push origin gh-pages -f && \
	git checkout master
