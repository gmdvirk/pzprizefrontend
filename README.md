"# pzprizefrontend" 
 cd /var/www/
  rm -rf pzprize
   cd ../../
    rm -rf pzprizefrontend
sudo mv /pzprizefrontend/build /var/www/pzprize/
systemctl restart nginx
pm2 start index.js --name  pzprize
