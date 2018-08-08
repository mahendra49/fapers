import requests, sys, webbrowser, bs4
print('Googling...')
data = open("data1.txt","w+")
#google it using command line 
res = requests.get("http://www.pvpsiddhartha.ac.in/syllabus_cse_14.html")
res.raise_for_status()
#pass the html to bs4
soup=bs4.BeautifulSoup(res.text,"html.parser")
#get all anchor tags inside of class ".r" 
#see google search html code for more info 
#and store all the data in a list
links=soup.select("div tr") 
 #all required list of data
# print(links)
print(links)
for i in links:
    print(i.getText())
    data.write(i.getText()+"\n")
