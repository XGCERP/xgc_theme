FROM frappe/erpnext:v16.latest

USER frappe
WORKDIR /home/frappe/frappe-bench

# Copy app source
COPY --chown=frappe:frappe ./xgc_theme /home/frappe/frappe-bench/apps/xgc_theme

# pip-install the package into the bench virtualenv so `import xgc_theme` works,
# then build static assets
RUN /home/frappe/frappe-bench/env/bin/pip install --no-deps -e apps/xgc_theme && \
    bench build --app xgc_theme

EXPOSE 8000 9000

CMD ["bench", "start"]
