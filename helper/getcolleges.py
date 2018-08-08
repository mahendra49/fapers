import requests, sys, webbrowser, bs4
print('Googling...')
data = open("data.txt","w+")
#google it using command line 
res = requests.get("https://www.4icu.org/in/a-z/")
res.raise_for_status()
#pass the html to bs4
soup=bs4.BeautifulSoup(res.text)
#get all anchor tags inside of class ".r" 
#see google search html code for more info 
#and store all the data in a list
links=soup.select("tbody td a")  #all required list of data
# print(links)

for i in links:
    print(i.getText())
    data.write(i.getText()+"\n")
