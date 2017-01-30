class CreateRatings < ActiveRecord::Migration[5.0]
  def change
    create_table :ratings do |t|
      t.float :rating
      t.integer :writer_id
      t.integer :receiver_id
      t.timestamps
    end
  end
end
