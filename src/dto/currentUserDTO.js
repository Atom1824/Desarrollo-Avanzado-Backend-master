class CurrentUserDTO {
  static fromModel(user) {
    return {
      id: user._id.toString(),
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      role: user.role,
      cart: user.cart?.toString() ?? null
    };
  }
}

export { CurrentUserDTO };
