import 'package:flutter/material.dart';
import 'package:bloc/bloc.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

import 'package:flutter_counter/blocs/blocs.dart';
import 'package:flutter_counter/pages/pages.dart';
import 'package:flutter_counter/delegates/delegates.dart';

void main() {
  BlocSupervisor().delegate = SimpleBlocDelegate();
  runApp(MyApp());
}

class MyApp extends StatefulWidget {
  @override
  State<StatefulWidget> createState() => MyAppState();
}

class MyAppState extends State<MyApp> {
  final CounterBloc _counterBoc = CounterBloc();
  final ThemeBloc _themeBoc = ThemeBloc();

  @override
  Widget build(BuildContext context) {
    return BlocProviderTree(
      blocProviders: [
        BlocProvider<CounterBloc>(bloc: _counterBoc),
        BlocProvider<ThemeBloc>(bloc: _themeBoc),
      ],
      child: BlocBuilder(
        bloc: _themeBoc,
        builder: (_, ThemeData theme) {
          return MaterialApp(
            title: 'Counter',
            home: CounterPage(),
            theme: theme,
          );
        },
      ),
    );
  }

  @override
  void dispose() {
    _counterBoc.dispose();
    super.dispose();
  }
}
