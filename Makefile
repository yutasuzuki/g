push:
	git add --all && \
	git commit -m "update" && \
	git push origin master

deploy:
	git fetch && \
	git checkout master && \
	git pull origin master && \
	git push origin master && \
	git checkout gh-pages && \
	git merge master && \
	git add --all && \
	git commit -m "deploy" && \
	git push origin gh-pages
