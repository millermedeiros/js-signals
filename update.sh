
# delete current files and copy latest files from master branch

rm -r docs/
git checkout master dist/docs/
mkdir docs/
mv dist/docs/* docs/.
rm -r dist/
git add -A
git status
