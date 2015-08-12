---
title: On why three is better than two
---

# On why three is better than two

Whats wrong with the following code (other than the fact that it is useless)?

```cpp
template <typename T>
class move_in_wrapper {
    T value_;

 public:
  move_in_wrapper(T&& value) : value_(std::move(value)) { }

  const T& get() const { return value_; }
  T&       get()       { return value_; }
};
```

There is nothing wrong with this code directly, but it is very easy to write
code with dangling references.  Each of the following lines is buggy, can you spot why?

```cpp
// Dangling reference
int& mutable_ref = move_in_wrapper<int>(42).get();
// Same
const int& const_ref = move_in_wrapper<int>(42).get();
// Tries to call copy constructor
auto ptr = move_in_wrapper<std::unique_ptr<int>>(new int(5)).get();
```

The situation is somewhat contrived, but imagine you had a function which returned a copy
of some object, and you only needed part of it, so you called a function like `get()`.

The C++ standard guarantees that constant lvalue references to a temporary object extends
the objects lifetime, and a const lvalue reference to a temporary subobject extends the
parent objects lifetime.
However, this is not the case for the function `get()`, as evidenced by the dangling reference
in the second buggy line.
This is because we aren\'t returning a temporary subobject, we are returning an lvalue reference.

In the case you can\'t expose the member variable directly, I believe the fix is to overload
on the objects reference type as follows.

```cpp
template <typename T>
class move_in_wrapper {
  T value_;

 public:
  move_in_wrapper(T&& value) : value_(std::move(value)) { }

  const T& get() const&  { return value_; }
  T&       get()      &  { return value_; }
  T        get()      && { return std::move(value_); }
};
```

Each of the three buggy lines above is fixed.

```cpp
// Doesn't compile because it is a reference to a rvalue
int& mutable_ref = move_in_wrapper<int>(42).get();
// The lifetime of the `int` is extended.
const int& const_ref = move_in_wrapper<int>(42).get();
// The move constructor is correctly called.
auto ptr = move_in_wrapper<std::unique_ptr<int>>(new int(5)).get();
```
