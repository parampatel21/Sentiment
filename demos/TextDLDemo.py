import os

cwd = os.getcwd()

title = input("Enter title: ")
filename = cwd + '\\demos\\' + title + ".txt"
textfile = open(filename, "w")
content = input("Enter content: ")
textfile.write(content)
textfile.close()