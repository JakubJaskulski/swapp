FROM dpage/pgadmin4:6.10
COPY /env/pgadmin/servers.json /pgadmin4
RUN /venv/bin/python /pgadmin4/setup.py --load-servers servers.json --replace --user admin@admin.com
