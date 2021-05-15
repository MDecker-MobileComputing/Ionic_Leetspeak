#!/bin/bash

ionic build
ionic capacitor sync
npx cap open electron
