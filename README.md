# Table of Contents
1. [COMO Last Staged](#como-last-staged)
2. [Find Bags ](#find-bags)
3. [Troubleshooting](#troubleshooting)
4. [Updating Scripts](#updating-scripts)
    * [Automatic Update](#automatic-update)
    * [Manual Update](#manual-update)

---
## COMO Last Staged
**LINKS:** ![COMO DASHBOARD](https://raw.githubusercontent.com/JeysonArtiles/amzn/master/como_dash.user.js) + ![COMO ROUTE](https://raw.githubusercontent.com/JeysonArtiles/amzn/master/como_route.user.js)
1. Go to **COMO Dashboard** an refresh page to load data **browser may appear stuck during loading**
2. Open route page and last bin location for each bag will show next to CART

   ![image](https://user-images.githubusercontent.com/12719223/128463273-f41f42cb-49b6-4b92-8625-50e562d09a7d.png)


---
## Find Bags
### BATCHERS MUST STAGE BAGS IN THE SAME BIN GROUP OR ASILE FOR THIS TO BE EFFECTIVE

**LINKS:** ![AFTLITE WMS](https://raw.githubusercontent.com/JeysonArtiles/amzn/master/findBags_aftlite.user.js) + ![COMO LABOR](https://raw.githubusercontent.com/JeysonArtiles/amzn/master/findBags_como.user.js)

1. Go to COMO Dashboard > Click on **Labor** Tab

   ![image](https://user-images.githubusercontent.com/12719223/128458348-0bd10ec9-8501-4851-87c9-67f1dc5cc2dc.png)

2. Click **Details** next to picklist

   ![image](https://user-images.githubusercontent.com/12719223/128460572-4dfe36c0-65fd-43e3-a7c2-11d9d83b47af.png)

3. Copy **Scannable Id**

   ![image](https://user-images.githubusercontent.com/12719223/128460587-da7336fe-91b3-42dc-b5c2-3cbb535c9f5d.png)

4. Go to: **WMS** page 

   ![image](https://user-images.githubusercontent.com/12719223/128462044-c44ec35d-8a5a-49e9-87cf-406307c7c515.png)

   **Confirm your session is not expired (being prompted to login) as the script can not work with an inactive session**

   ![image](https://user-images.githubusercontent.com/12719223/128461829-da1130e7-26e7-4ed3-9b9a-e0758e10ad8e.png)

5. Hit **Shift + F**. Copy Scannable Id then Press **Enter Key** / **OK**

   ![image](https://user-images.githubusercontent.com/12719223/128460736-c104005e-bb77-44ee-a176-4c8754d54ecb.png)

6. Wait for textbox below to pop up and copy text

   ![image](https://user-images.githubusercontent.com/12719223/128460802-c3d1bec3-29c7-4a01-b7b1-089ea37ab09f.png)

7. Go back to COMO **Labor** Tab

   ![image](https://user-images.githubusercontent.com/12719223/128460865-69fcd31f-a267-4063-a66d-e81420835f6a.png)

8. Press **Shift + F**. Paste text then Press Enter / OK

   ![image](https://user-images.githubusercontent.com/12719223/128461068-e1908e24-ae8c-4ddf-9616-c2fb8aafb50e.png)

9. Wait until results populate at the bottom of the page

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
