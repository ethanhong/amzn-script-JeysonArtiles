# Table of Contents
1. [Batching Monitor](#batching-monitor)
2. [UPH Check Rate](#uph-check-rate)
3. [COMO Last Staged](#como-last-staged)
4. [Find Bags ](#find-bags)
5. [Troubleshooting](#troubleshooting)
6. [Updating Scripts](#updating-scripts)
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
**LINKS:** ![COMO DASHBOARD](https://raw.githubusercontent.com/JeysonArtiles/amzn/master/como_dash.user.js) + ![COMO ROUTE](https://raw.githubusercontent.com/JeysonArtiles/amzn/master/como_route.user.js)
1. Go to **COMO Dashboard** an refresh page to load data
2. Open route page and last bin location for each bag will show next to CART

---
## UPH Check Rate
**LINK:** ![AFTLITE UPH CHECK RATE](https://github.com/JeysonArtiles/amzn/blob/master/aftlite_uph.user.js)

1. After generating report; Hit **Shift + R**

![image](https://user-images.githubusercontent.com/12719223/128310615-027d27d3-08f2-4f9b-bc7e-41425e91f90d.png)

2. Script will show current number for selected function - picking / receiving / stowing / counting. An above:under rate and perform calculations showing number of units based on function.

![image](https://user-images.githubusercontent.com/12719223/128311004-c8b640f4-f69f-4bcc-8089-8da826f7c8a1.png)

![image](https://user-images.githubusercontent.com/12719223/128311027-7649156d-9a16-4bc8-b8a7-88e2b003514d.png)

---
## Find Bags
### BATCHERS MUST STAGE BAGS IN THE SAME AREA / SAME ASILE 

**LINKS:** ![AFTLITE WMS](https://raw.githubusercontent.com/JeysonArtiles/amzn/master/findBags_aftlite.user.js) + ![COMO LABOR](https://raw.githubusercontent.com/JeysonArtiles/amzn/master/findBags_como.user.js)

2. Go to COMO Dashboard > Click on **Labor** Tab

![image](https://user-images.githubusercontent.com/12719223/128458348-0bd10ec9-8501-4851-87c9-67f1dc5cc2dc.png)

3. Click **Details** next to picklist

![image](https://user-images.githubusercontent.com/12719223/128460572-4dfe36c0-65fd-43e3-a7c2-11d9d83b47af.png)

4. Copy Scannable Id

![image](https://user-images.githubusercontent.com/12719223/128460587-da7336fe-91b3-42dc-b5c2-3cbb535c9f5d.png)

5. Go to: **WMS** page 

![image](https://user-images.githubusercontent.com/12719223/128462044-c44ec35d-8a5a-49e9-87cf-406307c7c515.png)

**Confirm your session is not expired (being prompted to login) as the script can not work with an inactive session**

![image](https://user-images.githubusercontent.com/12719223/128461829-da1130e7-26e7-4ed3-9b9a-e0758e10ad8e.png)

6. Hit “Shift + F”. Copy Scannable Id then Press Enter Key / OK

![image](https://user-images.githubusercontent.com/12719223/128460736-c104005e-bb77-44ee-a176-4c8754d54ecb.png)

7. Wait for textbox below to pops up and copy text

![image](https://user-images.githubusercontent.com/12719223/128460802-c3d1bec3-29c7-4a01-b7b1-089ea37ab09f.png)

8. Go back to COMO “Labor” Tab

![image](https://user-images.githubusercontent.com/12719223/128460865-69fcd31f-a267-4063-a66d-e81420835f6a.png)

9. Press **Shift + F**. Paste text then Press Enter / OK

![image](https://user-images.githubusercontent.com/12719223/128461068-e1908e24-ae8c-4ddf-9616-c2fb8aafb50e.png)

10. Wait until results populate at the bottom of the page

![image](https://user-images.githubusercontent.com/12719223/128461115-091ef85d-3d9d-4586-9a89-837f82110aaa.png)

---

## Troubleshooting

### If a script is not working refresh the page

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
