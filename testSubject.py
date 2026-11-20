from abc import ABC, abstractmethod
class BankAccount(ABC):
    def _init_(self, name, balance):
        self.name = name
        self.__balance = balance  # encapsulated
    @abstractmethod
    def account_type(self):
        pass
    def deposit(self, amount):
        if amount > 0:
            self.__balance += amount
            print("Deposited:", amount)
    def withdraw(self, amount):
        if amount <= self.__balance:
            self.__balance -= amount
            print("Withdrawn:", amount)
        else:
            print("Insufficient balance")
    def get_balance(self):
        return self.__balance
    
class SavingsAccount(BankAccount):
    def account_type(self):
        return "Savings Account"

class CurrentAccount(BankAccount):
    def account_type(self):
        return "Current Account"


acc1 = SavingsAccount("Deepak", 1000)
acc2 = CurrentAccount("Amit", 5000)
print(acc1.account_type())
acc1.deposit(500)
acc1.withdraw(300)
print("Balance:", acc1.get_balance())
print("\n", acc2.account_type())
acc2.withdraw(6000)
print("Balance:", acc2.get_balance())