from datetime import datetime
import time
import os
import logging

from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.cron import CronTrigger

logging.basicConfig()
logging.getLogger('apscheduler').setLevel(logging.DEBUG)


def tick():
    print("Tick! The time is: %s" % datetime.now())


if __name__ == "__main__":
    scheduler = BackgroundScheduler()
    # scheduler.add_job(func=tick, trigger='interval', seconds=3, id='my_job_id1')
    scheduler.add_job(tick, CronTrigger.from_crontab('0 0 1-15 may-aug *'))
    scheduler.start()
    print("press ctrl + {0} to exit".format("Break" if os.name == 'nt' else 'C'))

    try:
        while True:
            time.sleep(2)
            print('sleep')
            print(scheduler.get_job('my_job_id1'))
    except(KeyboardInterrupt, SystemExit):
        scheduler.shutdown()
        print('Exit The Job!')
