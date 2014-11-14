'''
Created on Nov 12, 2014

@author: ketongwang
'''
import sys

if __name__ == '__main__':
    f = open("./data/short_literature.list", "r").read().splitlines()
    i = 0
    jsonStr = ''
    for line in f:
        if line.strip():
            identifier, content = line.replace('\n', '').split(":", 1)
            if identifier == 'MOVI':
                if jsonStr != '':
#                    print jsonStr.rstrip(',')  + '}' # print the .list file
                    print "db.shortliterature.insert(" + jsonStr.rstrip(',') + '})' # print the mongodb query
                jsonStr = '{' + identifier + ': \"' + content.strip() + '\",' # double quotes needed
            else:
                author, title = content.split('\"', 1)
                jsonStr += ' ' + identifier + ': {Author: \"' + author.strip() + '\", Title: \"' + title.strip().replace('\".', '.\"') + "},"
#    print jsonStr.rstrip(',')  + '}'
    print "db.shortliterature.insert(" + jsonStr.rstrip(',') + '})'