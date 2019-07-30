from locust import HttpLocust, TaskSet, task


def login(l):
    response = l.client.post('/login')
    token = response.content
    print(f'Got token from login: {token}')
    return token


class MyTaskSet(TaskSet):
    def on_start(self):
        self.token = login(self)

    @task
    def my_task(self):
        print(f'executing with token: {self.token}')
        headers = {
            'Authorization': self.token
        }
        self.client.get('/', headers=headers)


class MyLocust(HttpLocust):
    task_set = MyTaskSet
    min_wait = 5000
    max_wait = 1500
