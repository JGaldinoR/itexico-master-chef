import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, tap, catchError } from 'rxjs/operators';

import { Recipe } from '../recipes/recipe.model';
import { RecipeService } from '../recipes/recipe.service';
import { of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DataStorageService {
  constructor(private http: HttpClient, private recipeService: RecipeService) {}

  storeRecipes() {
    const recipes = this.recipeService.getRecipes();
    this.http
      .put(
        'https://itexico-poc.firebaseio.com/recipes.json',
        recipes
      ).pipe(
        map((recipe) => {
          return recipe;
        }),
        catchError((error) => {
          return of(error);
        })
      )
      .subscribe((response) => {
        console.log(response);
      });
  }

  fetchRecipes() {
    return this.http
      .get<Recipe[]>(
        'https://itexico-poc.firebaseio.com/recipes.json'
      )
      .pipe(
        map(recipes => {
          return recipes.map((recipe) => {
            return {
              ...recipe,
              ingredients: recipe.ingredients ? recipe.ingredients : []
            };
          });
        }),
        tap((recipes) => {
          this.recipeService.setRecipes(recipes);
        }),
        catchError((error) =>{
          return of(error);
        })
      )
  }
}
