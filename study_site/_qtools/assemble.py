#!/usr/bin/env python3
"""Inline content.js + questions.js + app.js into a single index.html."""
import os
HERE=os.path.dirname(os.path.abspath(__file__))
SITE=os.path.join(HERE,'..')
def rd(p):
    with open(os.path.join(SITE,p),encoding='utf-8') as f: return f.read()
shell=rd('shell.html')
data='\n'.join([
 '<script>', rd('content.js'), '</script>',
 '<script>', rd('questions.js'), '</script>',
 '<script>', rd('app.js'), '</script>',
])
html=shell.replace('<!--DATA-->',data)
out=os.path.join(SITE,'index.html')
with open(out,'w',encoding='utf-8') as f: f.write(html)
print('wrote',out, round(os.path.getsize(out)/1024,1),'KB')
