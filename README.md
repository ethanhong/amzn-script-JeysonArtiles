# Table of Contents
1. [Batching Monitor](#batching-monitor)
2. [UPH Check Rate](#uph-check-rate)
3. [COMO Last Staged](#como-last-staged)
4. [Find Bags ](#find-bags)
5. [Updating Scripts](#updating-scripts)
    * [Automatic Update](#automatic-update)
    * [Manual Update](#manual-update)

---
## Batching Monitor
**LINK:** ![BATCHING MONITOR](https://raw.githubusercontent.com/JeysonArtiles/amzn/master/batchingMonitor_como.user.js)
1. Go to **COMO Dashboard**
2. Refresh page to confirm script is active
 
  ![image](https://user-images.githubusercontent.com/12719223/128308803-cbaa1d62-eeb3-4f3c-8696-17a5bc602d29.png)
  
3. Enter **Shift + B**
* Set number of tasks per batcher

    ![image](https://user-images.githubusercontent.com/12719223/128309592-203d860f-94cd-40d0-86ab-b888ba0cbf61.png)
    
4. COMO shows correct # of batchers

 ![image](https://user-images.githubusercontent.com/12719223/128309551-dec06c13-6a98-4c49-be2d-dd46a27c565b.png)

---
## COMO Last Staged
**LINK:** ![COMO DASHBOARD](https://raw.githubusercontent.com/JeysonArtiles/amzn/master/como_dash.user.js) + ![COMO ROUTE](https://raw.githubusercontent.com/JeysonArtiles/amzn/master/como_route.user.js)
1. Go to **COMO Dashboard** an refresh page to load data
2. Open route page and last bin location for each bag will show next to CART

---
## UPH Check Rate
1. Install https://github.com/JeysonArtiles/amzn/blob/master/aftlite_uph.user.js
2. After generating report; Hit **Shift + R**

![image](https://user-images.githubusercontent.com/12719223/128310615-027d27d3-08f2-4f9b-bc7e-41425e91f90d.png)

3. Script will show current number for selected function - picking / receiving / stowing / counting. An above:under rate and perform calculations showing number of units based on function.

![image](https://user-images.githubusercontent.com/12719223/128311004-c8b640f4-f69f-4bcc-8089-8da826f7c8a1.png)

![image](https://user-images.githubusercontent.com/12719223/128311027-7649156d-9a16-4bc8-b8a7-88e2b003514d.png)

---
## Find Bags
### DISCLAIMER: BATCHERS MUST STAGED BAGS IN THE SAME AREA FOR THIS TO WORK.
1. Install

https://raw.githubusercontent.com/JeysonArtiles/amzn/master/findBags_como.user.js

https://raw.githubusercontent.com/JeysonArtiles/amzn/master/findBags_aftlite.user.js

2. Go to COMO Dashboard > Click on **Labor** Tab
![image](https://user-images.githubusercontent.com/12719223/128458348-0bd10ec9-8501-4851-87c9-67f1dc5cc2dc.png)
3. 

---

## Updating Scripts

### Automatic Update

1. Click on **TamperMonkey Extension** in Browser
   * Select **Dashboard**

![TM_UPDATE_SETUP_1](https://github.com/JeysonArtiles/amzn/blob/master/.documentation/TM_UPDATE_SETUP_1.png)

2. Click **Settings** (Top-Right Of Screen)

![TM_UPDATE_SETUP_2](https://github.com/JeysonArtiles/amzn/blob/master/.documentation/TM_UPDATE_SETUP_2.png)

3. Select / Confirm **Every 6 Hours** Option Under **Userscript Update**

![TM_UPDATE_SETUP_3](https://github.com/JeysonArtiles/amzn/blob/master/.documentation/TM_UPDATE_SETUP_3.png)




### Manual Update

1. Click **Utilities**
   * Select **Check for userscript updates**

![ManualUpdateTamperMonkey](https://github.com/JeysonArtiles/amzn/blob/master/.documentation/ManualUpdateTamperMonkey.png)
