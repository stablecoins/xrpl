# Ripple USD (RLUSD) project

Demo project for the BizThon PBW Hackathon 2025 using the Ripple USD (RLUSD) stablecoin

[Demo video](https://youtu.be/-CRGmzJe7M8)

The site is also available live at [stablecoin.org](https://stablecoin.org).

Contact us : support@stablecoin.org

## How to Deploy?

This web application allows users to exchange **RLUSD** stablecoins for **DBT tokens**, which represent an investment in a fund.

To make the application work, you first need to create the **DBT token**. This token is issued from a **cold wallet** to a **hot wallet**, which will then create an offer to exchange **DBT** for **RLUSD**. This operation is performed using the `TokenCreate.js` script.

After the token is created, you can deploy the web application.


## Create the debt token DBT
```
cd token
node TokenCreate.js
```

## 🚀 How to Deploy

```
yarn install
yarn dev
```
