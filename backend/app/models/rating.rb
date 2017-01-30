class Rating < ApplicationRecord

  belongs_to(
    :writer,
    :class_name => "User",
    :foreign_key => :writer_id,
    :primary_key => :id
  )

  belongs_to(
    :receiver,
    :class_name => "User",
    :foreign_key => :receiver_id,
    :primary_key => :id
  )

end
