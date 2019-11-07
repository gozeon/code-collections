from pytz import utc
from datetime import datetime
import logging

logging.basicConfig()


from apscheduler.schedulers.blocking import BlockingScheduler
from apscheduler.schedulers.background import BackgroundScheduler
# from apscheduler.jobstores.mongodb import MongoDBJobStore
from apscheduler.jobstores.sqlalchemy import SQLAlchemyJobStore
from apscheduler.executors.pool import ThreadPoolExecutor, ProcessPoolExecutor

job_stores = {
    'default': SQLAlchemyJobStore(url='sqlite:///jobs.sqlite'),
    # 'mongo': MongoDBJobStore()
}

executors = {
    'default': ThreadPoolExecutor(20),
    'preocesspool': ProcessPoolExecutor(5)
}

job_defaults = {
    'coalesce': False,  # 合并
    'max_instances': 3
}

scheduler = BlockingScheduler(jobStores=job_stores, executors=executors, job_defaults=job_defaults, timezone=utc)


def tt():
    print(datetime.now())


def tt1():
    print('hello')


# logging.getLogger('apscheduler').setLevel(logging.DEBUG)


scheduler.add_job(func=tt, trigger='interval', seconds=1, id='my_job_id')
scheduler.add_job(func=tt1, trigger='cron', second='*/3', id='my_job_id1')

print(scheduler.get_job('my_job_id'))
print(scheduler.get_job('my_job_id1'))

scheduler.start()