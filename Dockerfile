FROM frappe/erpnext:v15.latest

# Set working directory
WORKDIR /home/frappe/frappe-bench

# Copy the theme app
COPY --chown=frappe:frappe ./xgc_theme /home/frappe/frappe-bench/apps/xgc_theme

# Switch to frappe user
USER frappe

# Install the theme app
RUN cd /home/frappe/frappe-bench && \
    bench get-app xgc_theme file:///home/frappe/frappe-bench/apps/xgc_theme && \
    bench build --app xgc_theme

# Expose ports
EXPOSE 8000 9000 6787

# Default command
CMD ["bench", "start"]
