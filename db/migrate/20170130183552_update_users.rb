class UpdateUsers < ActiveRecord::Migration[5.0]
  def change
    add_column :users, :admin, :boolean, default: false
    add_column :users, :strikes, :integer
    add_column :users, :last_location, :text
  end
end
