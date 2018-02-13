
/*

  Adds the beer and recipe tables

*/
module.exports = {

  async up({ db, logger })
  {

    await db.knex.schema.createTableIfNotExists('beers', table => {
      table.increments();
      table.string('name');
      table.string('style');
      table.string('og');
      table.string('fg');
      table.string('abv');
      table.string('ibu');
      table.text('description');
      table.timestamps(true, true);
    });

    logger.log('beers table created');

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
      table.timestamps(true, true);
    });

    logger.log('brew_notes table created');

    await db.knex.into('ingredient_types')
      .insert([ { name: 'hops', unit: 'oz' }, { name: 'grist', unit: 'lb' } ]);

  }
};
