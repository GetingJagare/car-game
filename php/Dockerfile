FROM php:8.1-apache

WORKDIR /var/www/app

RUN echo 'memory_limit = 128M' >> /usr/local/etc/php/conf.d/docker-php-memlimit.ini;
RUN echo '\nerror_reporting=E_ERROR|E_WARNING|E_PARSE|E_NOTICE' >> /usr/local/etc/php/conf.d/base.ini;
RUN echo '\nmax_execution_time=300' >> /usr/local/etc/php/conf.d/base.ini;
RUN echo '\ndisplay_errors=On' >> /usr/local/etc/php/conf.d/base.ini;
RUN echo '\nshort_open_tag=On' >> /usr/local/etc/php/conf.d/base.ini;
