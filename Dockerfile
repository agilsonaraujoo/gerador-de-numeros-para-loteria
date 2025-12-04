FROM nginx:alpine

LABEL org.opencontainers.image.source="https://github.com/agilsonaraujoo/gerador-de-n-meros-para-loteria"
LABEL org.opencontainers.image.licenses="MIT"

# Copy site files to nginx html directory
COPY . /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
