import yagmail
from nameko.rpc import rpc, RpcProxy


class Mail(object):
    name = "mail"

    @rpc
    def send(self, to, subject, contents):
        yag = yagmail.SMTP(user='liqiushuai@126.com',
                           password='qiankun.230',
                           host='smtp.126.com',
                           port=587)
        # yag.send(to=to.encode('utf-8'),
        #          subject=subject.encode('utf-8'),
        #          contents=[contents.encode('utf8')])
        yag.send(to=to, subject=subject, contents=[contents])


class Compute(object):
    name = "compute"
    mail = RpcProxy('mail')

    @rpc
    def compute(self, operation, value, other, email):
        operations = {'sum': lambda x, y: int(x) + int(y),
                      'mul': lambda x, y: int(x) * int(y),
                      'div': lambda x, y: int(x) / int(y),
                      'sub': lambda x, y: int(x) - int(y)}
        try:
            result = operations[operation](value, other)
        except Exception as e:
            self.mail.send.call_async(email, "An error occurred", str(e))
            raise
        else:
            self.mail.send.call_async(
                email,
                "Your operation is complete!",
                "The result is: %s" % result
            )
            return result
