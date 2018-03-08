
/*

  Adds the beer and recipe tables

*/
module.exports = {

  async up({ db, logger })
  {

    await db.knex.schema.createTableIfNotExists('beer_types', table => {
      table.increments();
      table.text('name').notNullable();
    });

    logger.log('beer_types table created');

    await db.knex.schema.createTableIfNotExists('beers', table => {
      table.increments();
      table.string('name');
      table.integer('main_type_id').references('beer_types.id');
      table.string('og');
      table.string('fg');
      table.string('abv');
      table.string('ibu');
      table.text('description');
      table.boolean('on_display');
      table.boolean('gone');
      table.timestamps(true, true);
    });

    logger.log('beers table created');

    await db.knex.schema.createTableIfNotExists('beer_type_tags', table => {
      table.integer('beer_id').references('beers.id');
      table.integer('type_id').references('beer_types.id');
      table.primary([ 'beer_id', 'type_id' ]);
    });

    logger.log('beer_type_tags table created');

    await db.knex.schema.createTableIfNotExists('unit_types', table => {
      table.increments();
      table.text('name');
    });

    await db.knex.into('unit_types')
      .insert([ { name: 'oz' }, { name: 'lb' }, { name: 'AA' } ]);

    logger.log('unit_types table created');

    await db.knex.schema.createTableIfNotExists('brew_phases', table => {
      table.increments();
      table.string('name');
    });

    await db.knex.schema.createTableIfNotExists('recipes', table => {
      table.increments();
      table.string('name');
      table.timestamps(true, true);
    });

    logger.log('recipes table created');

    await db.knex.schema.createTableIfNotExists('recipe_links', table => {
      table.increments();
      table.string('link');
      table.integer('recipe_id').references('recipes.id');
      table.timestamps(true, true);
    });

    logger.log('recipe_links table created');

    await db.knex.schema.createTableIfNotExists('ingredient_types', table => {
      table.increments();
      table.string('name');
      table.string('unit');
    });

    logger.log('ingredient_types table created');

    await db.knex.schema.createTableIfNotExists('ingredients', table => {
      table.increments();
      table.string('name');
      table.decimal('cost', 14, 2);
      table.integer('type_id').references('ingredient_types.id');
      table.timestamps(true, true);
    });

    logger.log('ingredients table created');

    await db.knex.schema.createTableIfNotExists('recipe_ingredients', table => {
      table.integer('recipe_id').references('recipes.id');
      table.integer('ingredient_id').references('ingredients.id');
      table.decimal('quantity').notNullable();
      table.decimal('duration');
      table.integer('brew_phase_id').references('brew_phases.id');
      table.text('duration_unit');
      table.integer('unit_type_id').references('unit_types.id');
      table.primary([ 'recipe_id', 'ingredient_id' ]);
    });

    logger.log('recipe_ingredients table created');

    await db.knex.schema.createTableIfNotExists('brews', table => {
      table.increments();
      table.string('name');
      table.date('brew_date');
      table.integer('batch_number');
      table.integer('brew_number');
      table.integer('beer_id').references('beers.id');
      table.integer('recipe_id').references('recipes.id');
      table.timestamps(true, true);
    });

    logger.log('brews table created');

    await db.knex.schema.createTableIfNotExists('brew_notes', table => {
      table.increments();
      table.text('note');
      table.text('value');
      table.date('date');
      table.text('time');
      table.integer('brew_id').references('brews.id');
      table.integer('unit_type_id').references('unit_types.id');
      table.timestamps(true, true);
    });

    logger.log('brew_notes table created');

  }
};